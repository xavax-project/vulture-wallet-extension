export var erc20Abi = {
    "source": {
      "hash": "0xa5a9796d4237cdfd5f7af429ae5101ef264f1c6a516eccb45d41b6c60ef8fece",
      "language": "ink! 3.0.0-rc9",
      "compiler": "rustc 1.60.0-nightly"
    },
    "contract": {
      "name": "erc20",
      "version": "0.1.0",
      "authors": [
        "[your_name] <[your_email]>"
      ]
    },
    "V3": {
      "spec": {
        "constructors": [
          {
            "args": [
              {
                "label": "initial_supply",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              },
              {
                "label": "name",
                "type": {
                  "displayName": [
                    "String"
                  ],
                  "type": 1
                }
              },
              {
                "label": "symbol",
                "type": {
                  "displayName": [
                    "String"
                  ],
                  "type": 1
                }
              }
            ],
            "docs": [],
            "label": "new",
            "payable": false,
            "selector": "0x9bae9d5e"
          }
        ],
        "docs": [],
        "events": [
          {
            "args": [
              {
                "docs": [],
                "indexed": true,
                "label": "from",
                "type": {
                  "displayName": [
                    "Option"
                  ],
                  "type": 12
                }
              },
              {
                "docs": [],
                "indexed": true,
                "label": "to",
                "type": {
                  "displayName": [
                    "Option"
                  ],
                  "type": 12
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "value",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "Transfer"
          },
          {
            "args": [
              {
                "docs": [],
                "indexed": true,
                "label": "owner",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "docs": [],
                "indexed": true,
                "label": "spender",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "value",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "Approval"
          }
        ],
        "messages": [
          {
            "args": [],
            "docs": [],
            "label": "total_supply",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Balance"
              ],
              "type": 0
            },
            "selector": "0xdb6375a8"
          },
          {
            "args": [],
            "docs": [],
            "label": "symbol",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "String"
              ],
              "type": 1
            },
            "selector": "0x9bd1933e"
          },
          {
            "args": [],
            "docs": [],
            "label": "name",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "String"
              ],
              "type": 1
            },
            "selector": "0x3adaf70d"
          },
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              }
            ],
            "docs": [],
            "label": "balance_of",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Balance"
              ],
              "type": 0
            },
            "selector": "0x0f755a56"
          },
          {
            "args": [
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "label": "spender",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              }
            ],
            "docs": [],
            "label": "allowance",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "Balance"
              ],
              "type": 0
            },
            "selector": "0x6a00165e"
          },
          {
            "args": [
              {
                "label": "spender",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "label": "value",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "approve",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 9
            },
            "selector": "0x681266a0"
          },
          {
            "args": [
              {
                "label": "recipent",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "label": "amount",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "transfer",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 9
            },
            "selector": "0x84a15da1"
          },
          {
            "args": [
              {
                "label": "sender",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "label": "recipent",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "label": "amount",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "transfer_from",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "Result"
              ],
              "type": 9
            },
            "selector": "0x0b396f18"
          }
        ]
      },
      "storage": {
        "struct": {
          "fields": [
            {
              "layout": {
                "cell": {
                  "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                  "ty": 0
                }
              },
              "name": "total_supply"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
                  "ty": 1
                }
              },
              "name": "name"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0200000000000000000000000000000000000000000000000000000000000000",
                  "ty": 1
                }
              },
              "name": "symbol"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0300000000000000000000000000000000000000000000000000000000000000",
                  "ty": 2
                }
              },
              "name": "balances"
            },
            {
              "layout": {
                "cell": {
                  "key": "0x0400000000000000000000000000000000000000000000000000000000000000",
                  "ty": 7
                }
              },
              "name": "allowances"
            }
          ]
        }
      },
      "types": [
        {
          "id": 0,
          "type": {
            "def": {
              "primitive": "u128"
            }
          }
        },
        {
          "id": 1,
          "type": {
            "def": {
              "primitive": "str"
            }
          }
        },
        {
          "id": 2,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 6,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 3
              },
              {
                "name": "V",
                "type": 0
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 3,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 4,
                    "typeName": "[u8; 32]"
                  }
                ]
              }
            },
            "path": [
              "ink_env",
              "types",
              "AccountId"
            ]
          }
        },
        {
          "id": 4,
          "type": {
            "def": {
              "array": {
                "len": 32,
                "type": 5
              }
            }
          }
        },
        {
          "id": 5,
          "type": {
            "def": {
              "primitive": "u8"
            }
          }
        },
        {
          "id": 6,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 4,
                    "typeName": "[u8; 32]"
                  }
                ]
              }
            },
            "path": [
              "ink_primitives",
              "Key"
            ]
          }
        },
        {
          "id": 7,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "name": "offset_key",
                    "type": 6,
                    "typeName": "Key"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "K",
                "type": 8
              },
              {
                "name": "V",
                "type": 0
              }
            ],
            "path": [
              "ink_storage",
              "lazy",
              "mapping",
              "Mapping"
            ]
          }
        },
        {
          "id": 8,
          "type": {
            "def": {
              "tuple": [
                3,
                3
              ]
            }
          }
        },
        {
          "id": 9,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 10
                      }
                    ],
                    "index": 0,
                    "name": "Ok"
                  },
                  {
                    "fields": [
                      {
                        "type": 11
                      }
                    ],
                    "index": 1,
                    "name": "Err"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 10
              },
              {
                "name": "E",
                "type": 11
              }
            ],
            "path": [
              "Result"
            ]
          }
        },
        {
          "id": 10,
          "type": {
            "def": {
              "tuple": []
            }
          }
        },
        {
          "id": 11,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "InsufficientBalance"
                  },
                  {
                    "index": 1,
                    "name": "InsufficientAllowance"
                  }
                ]
              }
            },
            "path": [
              "erc20",
              "erc20",
              "Error"
            ]
          }
        },
        {
          "id": 12,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "index": 0,
                    "name": "None"
                  },
                  {
                    "fields": [
                      {
                        "type": 3
                      }
                    ],
                    "index": 1,
                    "name": "Some"
                  }
                ]
              }
            },
            "params": [
              {
                "name": "T",
                "type": 3
              }
            ],
            "path": [
              "Option"
            ]
          }
        }
      ]
    }
  }