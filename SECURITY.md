# Security Policy

## Supported versions

Security fixes are made on the `master` branch and released in the next
version of the latest minor release line.

| Version | Supported |
|:--------|:---------:|
| `master` | Yes |
| 0.4.x   | Yes |
| < 0.4   | No  |

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues, pull requests
or discussions.

Report them privately through GitHub instead: open the
[Security tab](https://github.com/dillonzq/LoveIt/security) of the repository
and click **Report a vulnerability**, or use
[this link](https://github.com/dillonzq/LoveIt/security/advisories/new).

Please include:

- the theme version or commit, and the Hugo version (`hugo version`);
- the affected template, script or configuration option;
- steps or a minimal site to reproduce the problem;
- the impact, for example what an attacker can do and what they need to
  control (site configuration, page content, URL parameters, …).

LoveIt is maintained by volunteers. We try to acknowledge a report within
7 days and to keep you informed while we work on a fix. Once a fix is
released, we publish a security advisory and credit you unless you prefer to
stay anonymous.

## Scope

In scope:

- the theme's templates, shortcodes, render hooks, JavaScript and Sass;
- the build scripts and CI workflows in this repository;
- the way the theme loads and configures the bundled third-party libraries
  in `assets/lib/` and the CDN data files in `assets/data/cdn/`.

Out of scope:

- vulnerabilities in a third-party library itself. Report those to the
  library's maintainers. If the version bundled with LoveIt is affected,
  please let us know so that we can upgrade it;
- third-party services that a site can enable, such as comment systems,
  analytics or search providers;
- issues that require control of the site's own configuration or templates,
  since site owners already have full control of their output.
