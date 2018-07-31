export interface APIResult {
  success: string;
  error: string;
  payload: Object;
}

export class APIResultAuthTokenGet {
  token: string;
}

export class APIResultUserMeDetails {
  steam_id: string;
  scopes: string[];
}

export class APIResultOBSSceneList {
  scenes: string[];
  active_scene: string;
}

export class APIResultOBSStatus {
  recording: boolean;
  streaming: boolean;
}

export class APIResultUserScopeList {
  total: number;
  users: {
    id: string;
    scopes: string[];
  }[];
}

export class SimpleFile {
  filename: string;
  type: string;
  size: number;
}

export class APIResultVODFileList {
  vod: SimpleFile[];
}

export class APIResultOBSPlaylistGet {
  files: string[];
}

export class APIResultStatsCSVGet {
  csv: string;
}
