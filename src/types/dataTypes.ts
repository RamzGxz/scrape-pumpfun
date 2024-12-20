export interface DataType {
  mint:                       string;
  name:                       string;
  symbol:                     string;
  description:                string;
  image_uri:                  string;
  metadata_uri:               string;
  twitter:                    null | string;
  telegram:                   null | string;
  bonding_curve:              string;
  associated_bonding_curve:   string;
  creator:                    string;
  created_timestamp:          number;
  raydium_pool:               string;
  complete:                   boolean;
  virtual_sol_reserves:       number;
  virtual_token_reserves:     number;
  hidden:                     null;
  total_supply:               number;
  website:                    null | string;
  show_name:                  boolean;
  last_trade_timestamp:       number;
  king_of_the_hill_timestamp: number;
  market_cap:                 number;
  reply_count:                number;
  last_reply:                 number;
  nsfw:                       boolean;
  market_id:                  string;
  inverted:                   boolean;
  is_currently_live:          boolean;
  username:                   null | string;
  profile_image:              null | string;
  usd_market_cap:             number;
}
export interface FilteredDataType {
  mint: string;
  name: string;
  symbol: string;
  market_cap: number;
  created_timestamp: string;
  twitter: string;
  telegram: string;
  website: string;
}
