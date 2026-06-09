// Paste Gelato product UIDs here once per format group.
// The same physical product is used for every poster in the same format — only the print file changes.
// Keys follow the pattern: size_frame (e.g. 'A4_black', '12x16_wood').
// Leave the value as '' until the UID is confirmed from the Gelato dashboard.

export const GELATO_UIDS: Record<string, Record<string, string>> = {
  'a-series': {
    A4_none:    'flat_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver',
    A4_black:   'framed_poster_mounted_210x297mm-8x12-inch_black_wood_w12xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver',
    A4_white:   'framed_poster_mounted_210x297mm-8x12-inch_white_wood_w12xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver',
    A4_wood:    'framed_poster_mounted_210x297mm-8x12-inch_natural-wood_wood_w12xt22-mm_plexiglass_a4-8x12-inch_170-gsm-65lb-coated-silk_4-0_ver',
    A3_none:    'flat_a3_170-gsm-65lb-coated-silk_4-0_ver',
    A3_black:   'framed_poster_mounted_a3_black_wood_w12xt22-mm_plexiglass_a3_170-gsm-65lb-coated-silk_4-0_ver',
    A3_white:   'framed_poster_mounted_a3_white_wood_w12xt22-mm_plexiglass_a3_170-gsm-65lb-coated-silk_4-0_ver',
    A3_wood:    'framed_poster_mounted_a3_natural-wood_wood_w12xt22-mm_plexiglass_a3_170-gsm-65lb-coated-silk_4-0_ver',
    A2_none:    'flat_a2_170-gsm-65lb-coated-silk_4-0_ver',
    A2_black:   'framed_poster_mounted_a2_black_wood_w12xt22-mm_plexiglass_a2_170-gsm-65lb-coated-silk_4-0_ver',
    A2_white:   'framed_poster_mounted_a2_white_wood_w12xt22-mm_plexiglass_a2_170-gsm-65lb-coated-silk_4-0_ver',
    A2_wood:    'framed_poster_mounted_a2_natural-wood_wood_w12xt22-mm_plexiglass_a2_170-gsm-65lb-coated-silk_4-0_ver',
    A1_none:    'flat_a1_170-gsm-65lb-coated-silk_4-0_ver',
    A1_black:   'framed_poster_mounted_a1_black_wood_w12xt22-mm_plexiglass_a1_170-gsm-65lb-coated-silk_4-0_ver',
    A1_white:   'framed_poster_mounted_a1_white_wood_w12xt22-mm_plexiglass_a1_170-gsm-65lb-coated-silk_4-0_ver',
    A1_wood:    'framed_poster_mounted_a1_natural-wood_wood_w12xt22-mm_plexiglass_a1_170-gsm-65lb-coated-silk_4-0_ver',
  },
  'ratio-4x3': {
    '6x8_none':  'flat_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '6x8_black': 'framed_poster_mounted_150x200-mm-6x8-inch_black_wood_w12xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '6x8_white': 'framed_poster_mounted_150x200-mm-6x8-inch_white_wood_w12xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '6x8_wood':  'framed_poster_mounted_150x200-mm-6x8-inch_natural-wood_wood_w12xt22-mm_plexiglass_150x200-mm-6x8-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '12x16_none':  'flat_300x400-mm-12x16-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '12x16_black': 'framed_poster_mounted_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '12x16_white': 'framed_poster_mounted_300x400-mm-12x16-inch_white_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '12x16_wood':  'framed_poster_mounted_300x400-mm-12x16-inch_natural-wood_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '18x24_none':  'flat_450x600-mm-18x24-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '18x24_black': 'framed_poster_mounted_450x600-mm-18x24-inch_black_wood_w12xt22-mm_plexiglass_450x600-mm-18x24-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '18x24_white': 'framed_poster_mounted_450x600-mm-18x24-inch_white_wood_w12xt22-mm_plexiglass_450x600-mm-18x24-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '18x24_wood':  'framed_poster_mounted_450x600-mm-18x24-inch_natural-wood_wood_w12xt22-mm_plexiglass_450x600-mm-18x24-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '24x32_none':  'flat_600x800-mm-24x32-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '24x32_black': 'framed_poster_mounted_600x800-mm-24x32-inch_black_wood_w12xt22-mm_plexiglass_600x800-mm-24x32-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '24x32_white': 'framed_poster_mounted_600x800-mm-24x32-inch_white_wood_w12xt22-mm_plexiglass_600x800-mm-24x32-inch_170-gsm-65lb-coated-silk_4-0_ver',
    '24x32_wood':  'framed_poster_mounted_600x800-mm-24x32-inch_natural-wood_wood_w12xt22-mm_plexiglass_600x800-mm-24x32-inch_170-gsm-65lb-coated-silk_4-0_ver',
  },
};
