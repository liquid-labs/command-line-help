# This file was generated by @liquid-labs/sdlc-projects-workflow-local-node-build.
# Refer to https://npmjs.com/package/@liquid-labs/sdlc-projects-workflow-local-
# node-build for further details

#####
# build dist/command-line-help.js
#####

SDLC_COMMAND_LINE_HELP_JS:=$(DIST)/command-line-help.js
SDLC_COMMAND_LINE_HELP_JS_ENTRY=$(SRC)/index.mjs
BUILD_TARGETS+=$(SDLC_COMMAND_LINE_HELP_JS)

$(SDLC_COMMAND_LINE_HELP_JS): package.json $(SDLC_ALL_NON_TEST_JS_FILES_SRC)
	JS_BUILD_TARGET=$(SDLC_COMMAND_LINE_HELP_JS_ENTRY) \
	  JS_OUT=$@ \
	  $(SDLC_ROLLUP) --config $(SDLC_ROLLUP_CONFIG)

#####
# end dist/command-line-help.js
#####
