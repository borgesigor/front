enum DeviceType {
  PC = "PC",
  Tablet = "Tablet",
  Mobile = "Mobile",
}

export function getDeviceType(): DeviceType {
  const screenWidth = window.innerWidth;

  if (screenWidth >= 1024) {
    return DeviceType.PC;
  } else if (screenWidth >= 600) {
    return DeviceType.Tablet;
  } else {
    return DeviceType.Mobile;
  }
}

export function isPc(): boolean{
  if(getDeviceType() == DeviceType.PC ){
    return true
  }

  return false
}

export function isTablet(): boolean{
  if(getDeviceType() == DeviceType.Tablet ){
    return true
  }

  return false
}

export function isMobile(): boolean{
  if(getDeviceType() == DeviceType.Mobile ){
    return true
  }

  return false
}