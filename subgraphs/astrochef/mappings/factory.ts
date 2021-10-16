/* eslint-disable prefer-const */
import { BigInt } from "@graphprotocol/graph-ts";
import { Factory, AstroChef, Token } from "../generated/schema";
import { NewAstroChefContract } from "../generated/AstroChefFactory/AstroChefFactory";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./utils/erc20";
import {
  fetchEndBlock,
  fetchRewardPerBlock,
  fetchRewardToken,
  fetchStakeToken,
  fetchStartBlock,
  fetchUserLimit,
} from "./utils/smartchef";
import { BLACKLISTED_ADDRESSES, convertTokenToDecimal } from "./utils";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let FACTORY_ADDRESS = "0x927158be21fe3d4da7e96931bb27fd5059a8cbc2";

export function handleNewAstroChefContract(event: NewAstroChefContract): void {
  // Do not process some AstroChef smart contract, hiccup.
  if (BLACKLISTED_ADDRESSES.includes(event.params.astroChef.toHex())) {
    return;
  }

  let factory = Factory.load(FACTORY_ADDRESS);
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS);
    factory.totalAstroChef = ZERO_BI;
    factory.save();
  }
  factory.totalAstroChef = factory.totalAstroChef.plus(ONE_BI);
  factory.save();

  let stakeTokenAddress = fetchStakeToken(event.params.astroChef);
  let stakeToken = Token.load(stakeTokenAddress.toHex());
  if (stakeToken === null) {
    stakeToken = new Token(stakeTokenAddress.toHex());
    stakeToken.name = fetchTokenName(stakeTokenAddress);
    stakeToken.symbol = fetchTokenSymbol(stakeTokenAddress);
    stakeToken.decimals = fetchTokenDecimals(stakeTokenAddress);
    stakeToken.save();
  }

  let earnTokenAddress = fetchRewardToken(event.params.astroChef);
  let earnToken = Token.load(earnTokenAddress.toHex());
  if (earnToken === null) {
    earnToken = new Token(earnTokenAddress.toHex());
    earnToken.name = fetchTokenName(earnTokenAddress);
    earnToken.symbol = fetchTokenSymbol(earnTokenAddress);
    earnToken.decimals = fetchTokenDecimals(earnTokenAddress);
    earnToken.save();
  }

  let astroChef = new AstroChef(event.params.astroChef.toHex());
  astroChef.stakeToken = stakeToken.id;
  astroChef.earnToken = earnToken.id;
  astroChef.startBlock = fetchStartBlock(event.params.astroChef);
  astroChef.endBlock = fetchEndBlock(event.params.astroChef);
  astroChef.reward = convertTokenToDecimal(fetchRewardPerBlock(event.params.astroChef), earnToken.decimals);

  let userLimit = fetchUserLimit(event.params.astroChef);
  if (userLimit.gt(ZERO_BI)) {
    astroChef.limit = convertTokenToDecimal(userLimit, stakeToken.decimals);
  }

  astroChef.block = event.block.number;
  astroChef.timestamp = event.block.timestamp;
  astroChef.save();
}
