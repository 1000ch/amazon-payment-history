PROJECTNAME="Amazon Payment History"

all: prelogue archive epilogue

prelogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

archive: ./src
	@zip amazon-history.zip -r ./src

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prelogue archive epilogue
