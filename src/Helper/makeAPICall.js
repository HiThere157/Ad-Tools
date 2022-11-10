async function makeAPICall(
  command,
  args,
  postProcessor = (AdObject) => {
    return AdObject;
  },
  callback = () => {},
  errorCallback = () => {}
) {
  try {
    const result = await window.electronAPI.executeCommand(command, args);

    if (result.error) {
      throw result.error;
    }

    const res = {
      isOk: true,
      output: result.output,
      command,
      args,
    };
    callback(postProcessor(res.output));
    return res;
  } catch (error) {
    const res = {
      isOk: false,
      error: error.toString(),
      command,
      args,
    };
    errorCallback(res);
    return res;
  }
}

function getPropertiesWrapper(AdObject) {
  return AdObject.PropertyNames.map((property) => {
    return { key: property, value: AdObject[property] };
  });
}

function makeToList(AdObject) {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export { makeAPICall, getPropertiesWrapper, makeToList };
