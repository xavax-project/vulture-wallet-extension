export var erc721Abi = {
    "source": {
        "hash": "0xac290ce8e54bd2bb8f3e3525e201fe610cce7ae4a025d15dd59d2961e6bdbaa4",
        "language": "ink! 3.2.0",
        "compiler": "rustc 1.63.0-nightly"
      },
      "contract": {
        "name": "erc721",
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
                  "label": "name",
                  "type": {
                    "displayName": [
                      "String"
                    ],
                    "type": 14
                  }
                },
                {
                  "label": "symbol",
                  "type": {
                    "displayName": [
                      "String"
                    ],
                    "type": 14
                  }
                }
              ],
              "docs": [
                "Creates a new ERC-721 token contract."
              ],
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
                    "type": 16
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
                    "type": 16
                  }
                },
                {
                  "docs": [],
                  "indexed": true,
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Event emitted when a token transfer occurs."
              ],
              "label": "Transfer"
            },
            {
              "args": [
                {
                  "docs": [],
                  "indexed": true,
                  "label": "from",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "docs": [],
                  "indexed": true,
                  "label": "to",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "docs": [],
                  "indexed": true,
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Event emitted when a token approve occurs."
              ],
              "label": "Approval"
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
                    "type": 2
                  }
                },
                {
                  "docs": [],
                  "indexed": true,
                  "label": "operator",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "docs": [],
                  "indexed": false,
                  "label": "approved",
                  "type": {
                    "displayName": [
                      "bool"
                    ],
                    "type": 17
                  }
                }
              ],
              "docs": [
                " Event emitted when an operator is enabled or disabled for an owner.",
                " The operator can manage all NFTs of the owner."
              ],
              "label": "ApprovalForAll"
            }
          ],
          "messages": [
            {
              "args": [
                {
                  "label": "owner",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [
                " Returns the balance of the owner.",
                "",
                " This represents the amount of unique tokens the owner has."
              ],
              "label": "balance_of",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "u32"
                ],
                "type": 5
              },
              "selector": "0x0f755a56"
            },
            {
              "args": [
                {
                  "label": "token_id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [],
              "label": "token_uri",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "String"
                ],
                "type": 14
              },
              "selector": "0x5b64e66a"
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
                "type": 14
              },
              "selector": "0x3adaf70d"
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
                "type": 14
              },
              "selector": "0x9bd1933e"
            },
            {
              "args": [],
              "docs": [],
              "label": "total_supply",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "u32"
                ],
                "type": 5
              },
              "selector": "0xdb6375a8"
            },
            {
              "args": [
                {
                  "label": "owner",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "index",
                  "type": {
                    "displayName": [
                      "u32"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [],
              "label": "token_owner_by_index",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Option"
                ],
                "type": 15
              },
              "selector": "0x569513da"
            },
            {
              "args": [
                {
                  "label": "index",
                  "type": {
                    "displayName": [
                      "u32"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [],
              "label": "token_by_index",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Option"
                ],
                "type": 15
              },
              "selector": "0xcea2a4f3"
            },
            {
              "args": [
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Returns the owner of the token."
              ],
              "label": "owner_of",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Option"
                ],
                "type": 16
              },
              "selector": "0x99720c1e"
            },
            {
              "args": [
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Returns the approved account ID for this token if any."
              ],
              "label": "get_approved",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Option"
                ],
                "type": 16
              },
              "selector": "0x27592dea"
            },
            {
              "args": [
                {
                  "label": "owner",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "operator",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [
                " Returns `true` if the operator is approved by the owner."
              ],
              "label": "is_approved_for_all",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "bool"
                ],
                "type": 17
              },
              "selector": "0x0f5922e9"
            },
            {
              "args": [
                {
                  "label": "to",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "approved",
                  "type": {
                    "displayName": [
                      "bool"
                    ],
                    "type": 17
                  }
                }
              ],
              "docs": [
                " Approves or disapproves the operator for all tokens of the caller."
              ],
              "label": "set_approval_for_all",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0xcfd0c27b"
            },
            {
              "args": [
                {
                  "label": "to",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Approves the account to transfer the specified token on behalf of the caller."
              ],
              "label": "approve",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0x681266a0"
            },
            {
              "args": [
                {
                  "label": "destination",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Transfers the token from the caller to the given destination."
              ],
              "label": "transfer",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0x84a15da1"
            },
            {
              "args": [
                {
                  "label": "from",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "to",
                  "type": {
                    "displayName": [
                      "AccountId"
                    ],
                    "type": 2
                  }
                },
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Transfer approved or owned token."
              ],
              "label": "transfer_from",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0x0b396f18"
            },
            {
              "args": [
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Creates a new token."
              ],
              "label": "mint",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0xcfdd9aa2"
            },
            {
              "args": [
                {
                  "label": "id",
                  "type": {
                    "displayName": [
                      "TokenId"
                    ],
                    "type": 5
                  }
                }
              ],
              "docs": [
                " Deletes an existing token. Only the owner can burn the token."
              ],
              "label": "burn",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "Result"
                ],
                "type": 18
              },
              "selector": "0xb1efc17b"
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
                "name": "owned_tokens"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
                    "ty": 7
                  }
                },
                "name": "token_owner"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0200000000000000000000000000000000000000000000000000000000000000",
                    "ty": 7
                  }
                },
                "name": "token_approvals"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0300000000000000000000000000000000000000000000000000000000000000",
                    "ty": 8
                  }
                },
                "name": "owned_tokens_count"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0400000000000000000000000000000000000000000000000000000000000000",
                    "ty": 9
                  }
                },
                "name": "operator_approvals"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0500000000000000000000000000000000000000000000000000000000000000",
                    "ty": 12
                  }
                },
                "name": "all_tokens_index"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0600000000000000000000000000000000000000000000000000000000000000",
                    "ty": 13
                  }
                },
                "name": "all_tokens"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0700000000000000000000000000000000000000000000000000000000000000",
                    "ty": 14
                  }
                },
                "name": "name"
              },
              {
                "layout": {
                  "cell": {
                    "key": "0x0800000000000000000000000000000000000000000000000000000000000000",
                    "ty": 14
                  }
                },
                "name": "symbol"
              }
            ]
          }
        },
        "types": [
          {
            "id": 0,
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
                  "type": 1
                },
                {
                  "name": "V",
                  "type": 5
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
            "id": 1,
            "type": {
              "def": {
                "tuple": [
                  2,
                  5
                ]
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
                      "type": 3,
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
            "id": 3,
            "type": {
              "def": {
                "array": {
                  "len": 32,
                  "type": 4
                }
              }
            }
          },
          {
            "id": 4,
            "type": {
              "def": {
                "primitive": "u8"
              }
            }
          },
          {
            "id": 5,
            "type": {
              "def": {
                "primitive": "u32"
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
                      "type": 3,
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
                  "type": 5
                },
                {
                  "name": "V",
                  "type": 2
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
                  "type": 2
                },
                {
                  "name": "V",
                  "type": 5
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
            "id": 9,
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
                  "type": 10
                },
                {
                  "name": "V",
                  "type": 11
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
            "id": 10,
            "type": {
              "def": {
                "tuple": [
                  2,
                  2
                ]
              }
            }
          },
          {
            "id": 11,
            "type": {
              "def": {
                "tuple": []
              }
            }
          },
          {
            "id": 12,
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
                  "type": 5
                },
                {
                  "name": "V",
                  "type": 5
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
            "id": 13,
            "type": {
              "def": {
                "sequence": {
                  "type": 5
                }
              }
            }
          },
          {
            "id": 14,
            "type": {
              "def": {
                "primitive": "str"
              }
            }
          },
          {
            "id": 15,
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
                          "type": 5
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
                  "type": 5
                }
              ],
              "path": [
                "Option"
              ]
            }
          },
          {
            "id": 16,
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
                          "type": 2
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
                  "type": 2
                }
              ],
              "path": [
                "Option"
              ]
            }
          },
          {
            "id": 17,
            "type": {
              "def": {
                "primitive": "bool"
              }
            }
          },
          {
            "id": 18,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 11
                        }
                      ],
                      "index": 0,
                      "name": "Ok"
                    },
                    {
                      "fields": [
                        {
                          "type": 19
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
                  "type": 11
                },
                {
                  "name": "E",
                  "type": 19
                }
              ],
              "path": [
                "Result"
              ]
            }
          },
          {
            "id": 19,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "index": 0,
                      "name": "NotOwner"
                    },
                    {
                      "index": 1,
                      "name": "NotApproved"
                    },
                    {
                      "index": 2,
                      "name": "TokenExists"
                    },
                    {
                      "index": 3,
                      "name": "TokenNotFound"
                    },
                    {
                      "index": 4,
                      "name": "CannotInsert"
                    },
                    {
                      "index": 5,
                      "name": "CannotFetchValue"
                    },
                    {
                      "index": 6,
                      "name": "NotAllowed"
                    }
                  ]
                }
              },
              "path": [
                "erc721",
                "erc721",
                "Error"
              ]
            }
          }
        ]
      }
  }