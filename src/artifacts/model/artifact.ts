import { FileArtifact } from "./file_artifact";

export interface Artifact {
  artifactId: string;
  owner: string;
  name: string;
  description: string;
  types: string[];
  files: FileArtifact[];
  dependencies: string;
  usage: string;
  last_modified: string;
  lastName?: string;
}
