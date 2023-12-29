import { FileType } from "./file_type";

export interface FileArtifact {
  name: string;
  size: number;
  type: FileType;
  url: string;
  id?: string;
}
