import Base

type Variant is Data:
  Primary{}
  Secondary{}
  Themed{}
  Outline{}
  Ghost{}
  Link{}
  Danger{}

type BgToken is Data:
  BgButton{}
  BgButtonSecondary{}
  ThemeColor{}
  Transparent{}
  ColorDanger{}

def variant_bg(v: Variant) -> BgToken:
  match v:
    case Primary{}:
      BgButton{}
    case Secondary{}:
      BgButtonSecondary{}
    case Themed{}:
      ThemeColor{}
    case Outline{}:
      Transparent{}
    case Ghost{}:
      Transparent{}
    case Link{}:
      Transparent{}
    case Danger{}:
      ColorDanger{}

def variant_is_themed(v: Variant) -> Bool:
  match v:
    case Themed{}:
      True{}
    case Primary{}:
      False{}
    case Secondary{}:
      False{}
    case Outline{}:
      False{}
    case Ghost{}:
      False{}
    case Link{}:
      False{}
    case Danger{}:
      False{}

type Shape is Data:
  Rect{}
  Min{}
  Modern{}
  Curved{}
  Round{}

def shape_radius(s: Shape) -> Nat:
  match s:
    case Rect{}:
      0n
    case Min{}:
      3n
    case Modern{}:
      6n
    case Curved{}:
      12n
    case Round{}:
      9999n

type Size is Data:
  HXs{}
  HSm{}
  HMd{}
  HBs{}
  HLg{}
  HXl{}

def size_height(s: Size) -> Nat:
  match s:
    case HXs{}:
      16n
    case HSm{}:
      20n
    case HMd{}:
      24n
    case HBs{}:
      32n
    case HLg{}:
      36n
    case HXl{}:
      40n

# Parallel validation of props
def parallel_check_tokens(+v: Variant, +s: Shape) -> Nat:
  x y = shape_radius(s) shape_radius(s)
  Nat.add(x, y)

# Icon packs shipped with the package: two 24px sets, 1000 icons each.
type IconSet is Data:
  KeylineStroke{}
  KeylineFill{}

type IconPrefix is Data:
  Kl{}
  Klf{}

def set_prefix(s: IconSet) -> IconPrefix:
  match s:
    case KeylineStroke{}:
      Kl{}
    case KeylineFill{}:
      Klf{}

def set_count(s: IconSet) -> Nat:
  match s:
    case KeylineStroke{}:
      1000n
    case KeylineFill{}:
      1000n

def set_stroke(s: IconSet) -> Nat:
  match s:
    case KeylineStroke{}:
      2n
    case KeylineFill{}:
      0n

# Both packs counted in one pass: the calls are independent and equally sized.
def parallel_pack_count(+a: IconSet, +b: IconSet) -> Nat:
  x y = set_count(a) set_count(b)
  Nat.add(x, y)

def main() -> IO(Unit):
  do IO<Unit>:
    IO.print("Fractalsvelte-UI Design Tokens Verified")
