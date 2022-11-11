async function makeAPICall(
  command,
  args,
  postProcessor = (AdObject) => {
    return AdObject;
  },
  callback = () => {},
  errorCallback = () => {}
) {
  callback([]);
  errorCallback({});

  try {
    const result = await window.electronAPI.executeCommand(command, args);

    if (result.error) {
      throw result.error;
    }

    callback(postProcessor(result.output));
    return true;
  } catch (error) {
    errorCallback({
      isOk: false,
      error: error.toString(),
      command,
      args,
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

function makeToList(AdObject) {
  if (!Array.isArray(AdObject)) {
    return [AdObject];
  }
  return AdObject;
}

export { makeAPICall, getPropertiesWrapper, makeToList };
