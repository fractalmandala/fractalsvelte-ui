import Base
import ./core.bend as Core

# LAW: Primary variant background MUST be BgButton, never ThemeColor
law primary_is_bg_button:
  {Core.variant_bg(Core.Primary{}) == Core.BgButton{} : Core.BgToken}

law primary_is_not_themed:
  {Core.variant_is_themed(Core.Primary{}) == False{} : Bool}

# LAW: Themed variant background MUST be ThemeColor
law themed_is_theme_color:
  {Core.variant_bg(Core.Themed{}) == Core.ThemeColor{} : Core.BgToken}

law themed_is_themed:
  {Core.variant_is_themed(Core.Themed{}) == True{} : Bool}

# LAW: Secondary variant background is BgButtonSecondary
law secondary_is_bg_secondary:
  {Core.variant_bg(Core.Secondary{}) == Core.BgButtonSecondary{} : Core.BgToken}

# LAW: Outline, Ghost, and Link backgrounds are Transparent
law outline_is_transparent:
  {Core.variant_bg(Core.Outline{}) == Core.Transparent{} : Core.BgToken}

law ghost_is_transparent:
  {Core.variant_bg(Core.Ghost{}) == Core.Transparent{} : Core.BgToken}

law link_is_transparent:
  {Core.variant_bg(Core.Link{}) == Core.Transparent{} : Core.BgToken}

# LAW: Canonical shapes border radius invariants
law rect_radius_zero:
  {Core.shape_radius(Core.Rect{}) == 0n : Nat}

law min_radius_three:
  {Core.shape_radius(Core.Min{}) == 3n : Nat}

law modern_radius_six:
  {Core.shape_radius(Core.Modern{}) == 6n : Nat}

law curved_radius_twelve:
  {Core.shape_radius(Core.Curved{}) == 12n : Nat}

law round_radius_full:
  {Core.shape_radius(Core.Round{}) == 9999n : Nat}

# LAW: Canonical height sizes (16, 20, 24, 32, 36, 40)
law size_h_xs_is_16:
  {Core.size_height(Core.HXs{}) == 16n : Nat}

law size_h_sm_is_20:
  {Core.size_height(Core.HSm{}) == 20n : Nat}

law size_h_md_is_24:
  {Core.size_height(Core.HMd{}) == 24n : Nat}

law size_h_bs_is_32:
  {Core.size_height(Core.HBs{}) == 32n : Nat}

law size_h_lg_is_36:
  {Core.size_height(Core.HLg{}) == 36n : Nat}

law size_h_xl_is_40:
  {Core.size_height(Core.HXl{}) == 40n : Nat}

# LAW: exported name prefixes are kl (stroke) and klf (fill)
law stroke_prefix_is_kl:
  {Core.set_prefix(Core.KeylineStroke{}) == Core.Kl{} : Core.IconPrefix}

law fill_prefix_is_klf:
  {Core.set_prefix(Core.KeylineFill{}) == Core.Klf{} : Core.IconPrefix}

# LAW: each shipped pack carries 1000 icons
law stroke_pack_has_1000:
  {Core.set_count(Core.KeylineStroke{}) == 1000n : Nat}

law fill_pack_has_1000:
  {Core.set_count(Core.KeylineFill{}) == 1000n : Nat}

# LAW: the stroke pack draws at 2, the fill pack has no stroke
law stroke_width_is_two:
  {Core.set_stroke(Core.KeylineStroke{}) == 2n : Nat}

law fill_pack_has_no_stroke:
  {Core.set_stroke(Core.KeylineFill{}) == 0n : Nat}
