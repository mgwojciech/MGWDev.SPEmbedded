interface Application {
    id: string;
    displayName: string;
  }
  
  interface User {
    email: string;
    id: string;
    displayName: string;
  }
  
  interface CreatedBy {
    application: Application;
    user: User;
  }
  
  interface LastModifiedBy {
    application: Application;
    user: User;
  }
  
  interface ParentReference {
    driveType: string;
    driveId: string;
    id: string;
    name: string;
    path: string;
    siteId: string;
  }
  
  interface Hashes {
    quickXorHash: string;
  }
  
  interface File {
    mimeType: string;
    hashes: Hashes;
  }
  
  interface FileSystemInfo {
    createdDateTime: string;
    lastModifiedDateTime: string;
  }
  
  interface Shared {
    scope: string;
  }
  
  interface GraphItem {
    "@microsoft.graph.downloadUrl": string;
    createdDateTime: string;
    eTag: string;
    id: string;
    lastModifiedDateTime: string;
    name: string;
    webUrl: string;
    cTag: string;
    size: number;
    createdBy: CreatedBy;
    lastModifiedBy: LastModifiedBy;
    parentReference: ParentReference;
    file: File;
    fileSystemInfo: FileSystemInfo;
    shared: Shared;
    folder?: any;
  }
