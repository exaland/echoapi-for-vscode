export interface BaseScript {
  // Pre-request script content
  pre_script: string;
  // Whether pre-request script is enabled
  pre_script_switch?: 1 | -1;
  // Post-response script content
  test: string;
  // Whether post-response script is enabled
  test_switch?: 1 | -1;
}
