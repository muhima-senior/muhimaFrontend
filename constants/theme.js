const COLORS = {
  primary: "#312651",
  secondary: "#00B300",
  tertiary: "#FF7754",

  yellow: "#FFC000",
  gray: "#83829A",
  gray2: "#C1C0C8",
  red: "#DC143C",

  white: "#F3F4F8",
  lightWhite: "#FAFAFC",
  black: "#000000",
  green:"#013220",
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
