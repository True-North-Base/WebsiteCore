import * as migration_20260828_034315_initial_phase3_schema from './20260828_034315_initial_phase3_schema';
import * as migration_20260829_225445_mobile_gallery_refinement from './20260829_225445_mobile_gallery_refinement';
import * as migration_20260830_033457_property_information_refinement from './20260830_033457_property_information_refinement';
import * as migration_20260831_161606_launch_hardening_chunk_2 from './20260831_161606_launch_hardening_chunk_2';

export const migrations = [
  {
    up: migration_20260828_034315_initial_phase3_schema.up,
    down: migration_20260828_034315_initial_phase3_schema.down,
    name: '20260828_034315_initial_phase3_schema',
  },
  {
    up: migration_20260829_225445_mobile_gallery_refinement.up,
    down: migration_20260829_225445_mobile_gallery_refinement.down,
    name: '20260829_225445_mobile_gallery_refinement',
  },
  {
    up: migration_20260830_033457_property_information_refinement.up,
    down: migration_20260830_033457_property_information_refinement.down,
    name: '20260830_033457_property_information_refinement',
  },
  {
    up: migration_20260831_161606_launch_hardening_chunk_2.up,
    down: migration_20260831_161606_launch_hardening_chunk_2.down,
    name: '20260831_161606_launch_hardening_chunk_2',
  },
];
