
/**
 * Command options for 'challenge' command
 */
export interface ChallengeCommandOptions {
  output: string;
  size?: string;
  verbose?: boolean;
}

/**
 * Command options for 'sign' command
 */
export interface SignCommandOptions {
  input: string;
  key: string;
  id?: string;
  output: string;
  verbose?: boolean;
}

export interface VerifyCommandOptions {
  input: string;
  key: string;
  id?: string;
  verbose?: boolean;
}

/**
 * Command options for 'verify-proof' command
 */
export interface VerifyProofCommandOptions {
  input: string;
  challenge: string;
  id: string;
  verbose?: boolean;
}

export interface ProveCommandOptions {
  input: string;
  proof: string;
  challenge: string;
  output: string;
  format: string;
  verbose?: boolean;
}

/**
 * Command options for 'info' command
 */
export interface InfoCommandOptions {
  verbose?: boolean;
}

/**
 * Command options for 'derive' command
 */
export interface DeriveCommandOptions {
  input: string;
  purpose: string;
  output?: string;
  algorithm?: string;
  format?: string;
  verbose?: boolean;
}

/**
 * Command options for 'create' command
 */
export interface CreateCommandOptions {
  input: string;
  output?: string;
  salt?: string;
  algorithm?: string;
  format?: string;
  verbose?: boolean;
}