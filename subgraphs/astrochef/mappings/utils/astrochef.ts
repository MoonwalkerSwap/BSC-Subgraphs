/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { AstroChef } from "../../generated/AstroChefFactory/AstroChef";

export let ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export function fetchStakeToken(astroChefAddress: Address): Address {
  let contract = AstroChef.bind(astroChefAddress);
  let nameValue = Address.fromString(ADDRESS_ZERO);
  let nameResult = contract.try_stakedToken();
  if (!nameResult.reverted) {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchRewardToken(astroChefAddress: Address): Address {
  let contract = AstroChef.bind(astroChefAddress);
  let nameValue = Address.fromString(ADDRESS_ZERO);
  let nameResult = contract.try_rewardToken();
  if (!nameResult.reverted) {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchStartBlock(astroChefAddress: Address): BigInt {
  let contract = AstroChef.bind(astroChefAddress);
  let decimalValue = BigInt.fromI32(0);
  let decimalResult = contract.try_startBlock();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return decimalValue;
}

export function fetchEndBlock(astroChefAddress: Address): BigInt {
  let contract = AstroChef.bind(astroChefAddress);
  let decimalValue = BigInt.fromI32(0);
  let decimalResult = contract.try_bonusEndBlock();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return decimalValue;
}

export function fetchRewardPerBlock(astroChefAddress: Address): BigInt {
  let contract = AstroChef.bind(astroChefAddress);
  let decimalValue = BigInt.fromI32(0);
  let decimalResult = contract.try_rewardPerBlock();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return decimalValue;
}

export function fetchUserLimit(astroChefAddress: Address): BigInt {
  let contract = AstroChef.bind(astroChefAddress);
  let decimalValue = BigInt.fromI32(0);
  let decimalResult = contract.try_poolLimitPerUser();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return decimalValue;
}
