import {MoralisConfiguration} from '../../app/@models/moralis-configuration';

export const MoralisProductionEnvironment: MoralisConfiguration = {
  applicationId: 'vdlR2AWJ1Ri1xcgNQGk0gngssN6tLn6TC4nQRzDX',
  serverUrl: 'https://b9jvsr9kc05t.usemoralis.com:2053/server',
  chain: 'avalanche',
  tables: {
    transaction: 'AvaxTransactions',
    stakeWithdraw: 'zBOOFIWithdraws',
    wellOfSoulsHarvest: 'WellOfSoulsHarvest',
    cauldronDeposit: 'CauldronDeposit',
    cauldronWithdraw: 'CauldronWithdraw',
    wellOfSoulsContributor: 'WellOfSoulsContributor',
  },
}

export const MoralisStagingEnvironment: MoralisConfiguration = {
  applicationId: 'jJ0PcVywg4kH3SEHxpwGTHYi7Rdg13Hq6cPRfrZ5',
  serverUrl: 'https://lso3gjmxc8vh.usemoralis.com:2053/server',
  chain: 'avalanche',
  tables: {
    transaction: 'AvaxTransactions',
    stakeWithdraw: 'zBOOFIWithdraws',
    wellOfSoulsHarvest: 'WellOfSoulsHarvest',
    cauldronDeposit: 'CauldronDeposit',
    cauldronWithdraw: 'CauldronWithdraw',
    wellOfSoulsContributor: 'WellOfSoulsContributor',
  },
}

export const MoralisTestingEnvironment: MoralisConfiguration = {
  applicationId: 'Kp87BO6yIbg3MrfuaxJ4cM0Jn7fVFmcebPCBxAis',
  serverUrl: 'https://xcherpl3yzrm.usemoralis.com:2053/server',
  chain: 'avalanche',
  tables: {
    transaction: 'AvaxTransactions',
    stakeWithdraw: 'zBOOFIWithdraws',
    wellOfSoulsHarvest: 'WellOfSoulsHarvest',
    cauldronDeposit: 'CauldronDeposit',
    cauldronWithdraw: 'CauldronWithdraw',
    wellOfSoulsContributor: 'WellOfSoulsContributor',
  },
}
