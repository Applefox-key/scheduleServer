export const reqWrapper = async (callback, params = []) => {
  console.log(params);
  try {
    let result = await callback(...params);
    // console.log("request __________");
    console.log(callback);
    // console.log("result");
    console.log(result);

    return {
      error: !!result.error,
      status: result.error ? 400 : 200,
      json: result.error
        ? { error: result.error }
        : { message: "success", resultData: result },
    };
  } catch (error) {
    // console.log("request __________");
    console.log(callback);
    // console.log("error");
    console.log(error);
    return { error: true, status: 400, json: { error: error.message } };
  }
};
