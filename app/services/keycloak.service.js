async function getSession(ssokey, clientId) {
  try {
    const token = await tokenHelper.getTokenConsent();
    const response = await fetch(`${config.consent.api.url}/sessions/${ssokey}/${clientId}`, {
      headers: {
        authorization: `Bearer ${token}`,
        [config.consent.api.extra_header]: config.consent.api.extra_header_value,
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.log('Something went wrong in getSession', e);
    throw e;
  }
}

module.exports = {
  getSessions,
  getSession,
};
