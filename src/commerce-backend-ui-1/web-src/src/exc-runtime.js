(function loadExperienceCloudRuntime(document, window) {
  if (window.location === window.parent.location) {
    throw new Error('Module Runtime: Needs to be within an iframe!');
  }

  const searchParams = new URL(window.location.href).searchParams;
  const moduleRuntimeParam = searchParams.get('_mr');
  const runtimeScript = moduleRuntimeParam || (!window.EXC_US_HMR
    ? moduleRuntimeParam
    : window.sessionStorage.getItem('unifiedShellMRScript'));

  if (!runtimeScript) {
    throw new Error('Module Runtime: Missing script!');
  }

  const runtimeUrl = new URL(decodeURIComponent(runtimeScript));

  if (runtimeUrl.protocol !== 'https:') {
    throw new Error('Module Runtime: Must be HTTPS!');
  }

  const isAllowedAdobeDomain = /^(exc-unifiedcontent\.)?experience(-qa|-stage|-cdn|-cdn-stage)?\.adobe\.(com|net)$/.test(runtimeUrl.hostname);
  const isAllowedCorpDomain = /localhost\.corp\.adobe\.com$/.test(runtimeUrl.hostname);

  if (!isAllowedAdobeDomain && !isAllowedCorpDomain) {
    throw new Error('Module Runtime: Invalid domain!');
  }

  if (!/\.js$/.test(runtimeUrl.pathname)) {
    throw new Error('Module Runtime: Must be a JavaScript file!');
  }

  if (window.EXC_US_HMR) {
    window.sessionStorage.setItem('unifiedShellMRScript', runtimeUrl.toString());
  }

  let script = document.createElement('script');
  script.async = true;
  script.src = runtimeUrl.toString();
  script.onload = script.onreadystatechange = function onLoad() {
    if (script.readyState && !/loaded|complete/.test(script.readyState)) {
      return;
    }

    script.onload = null;
    script.onreadystatechange = null;
    script = undefined;

    if ('EXC_MR_READY' in window) {
      window.EXC_MR_READY();
    }
  };

  document.head.appendChild(script);
})(document, window);