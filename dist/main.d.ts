interface Input {
    'include-gitignore': boolean;
    'ignore-default': boolean;
    files: string;
}
export declare const runAction: (input: Input) => Promise<void>;
export declare function run(): Promise<void>;
export {};
