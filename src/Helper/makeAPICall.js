async function makeAPICall(
  command,
  args,
  postProcessor = (AdObject) => {
    return AdObject;
  },
  callback = () => {},
  errorCallback = () => {}
) {
  const postProcessorList = makeToList(postProcessor);
  const callBackList = makeToList(callback);
  const errorCallBackList = makeToList(errorCallback);

  callBackList.forEach((callback) => {
    callback([]);
  });
  errorCallBackList.forEach((errorCallback) => {
    errorCallback([]);
  });

  try {
    const result = await window.electronAPI.executeCommand(command, args);

    if (result.error) {
      throw result.error;
    }

    callBackList.forEach((callback, index) => {
      callback(postProcessorList[index](result.output));
    });

    return true;
  } catch (error) {
    errorCallBackList.forEach((errorCallback) => {
      errorCallback({
        isOk: false,
        error: error.toString(),
        command,
        args,
      });
    });
    return false;
  }
}

// Wrap all Properties in {key: [key], value: [value]} objects (attributes table)
function getPropertiesWrapper(AdObject) {
  return AdObject.PropertyNames.map((property) => {
    return { key: property, value: AdObject[property] };
  });
}

// Get Memberof Property from Get-AdUser Output and extract information
function getMembershipFromAdUser(AdObject) {
  const getCN = (dn) => {
    const cn = dn.split(",").filter((unit) => unit.startsWith("CN="))[0];
    return cn?.split("=")[1] ?? "";
  };

  return AdObject.MemberOf.map((group) => {
    return { Name: getCN(group), DistinguishedName: group };
  });
}

function makeToList(AdObject) {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export {
  makeAPICall,
  getPropertiesWrapper,
  getMembershipFromAdUser,
  makeToList,
};
