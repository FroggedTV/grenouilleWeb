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
  scopes: {
    [id: string]: string[]
  };
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
    name: string;
    scopes: string[];
  }[];
}

export class APIResultUserNameRefresh {
  id: string;
  name: string;
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

export class APIResultStatsSceneStatusUpdate {
  activated: boolean;
}

export class APIResultStatsSceneStatusGet {
  activated: boolean;
}


export class APIResultStatsSceneUpdate {
  img: string;
  last_modified: string;
}

export class APIResultStatsSceneGet {
  img: string;
  last_modified: string;
  continue: boolean;
}

export class APIResultVODDiskUsage {
  vod_size: number;
  disk_total: number;
  disk_used: number;
  disk_free: number;
}
