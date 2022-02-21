//randomNames.ts just contains methods to get "random" strings, used for UI purposes n stuff of course! Just for fun.


const accountNameExamples: string[] = [
    "DeFi Account",       "NFT Account",
    "Public Account",     "Public Account",
    "Charity Account",    "Savings Account",
    "Spendings Account",  "Income Account",
    "Taxes Account",      "GPU Money",
    "For DAOs",           "Experiment Money",
    "uwu money",          "Vulture by xavax.io",
    "Tx Fee Savings",     "Rocketry Money",
    "Revolution Savings", "Mars Trip",
    "Inssurance Money",   "HODL Account",
    "Ape money",          "Ape money",
    "owo money",
]

export function getRandomAccountName(): string {
    return accountNameExamples[Math.floor(Math.random() * accountNameExamples.length)];
}