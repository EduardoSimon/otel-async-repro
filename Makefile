COMPOSE_FILE := docker-compose.yml

.PHONY: start
start:
	@docker-compose -f $(COMPOSE_FILE) up --build

.PHONY: exec
exec:
	docker-compose -f $(COMPOSE_FILE) up $(CMD)

.PHONY: clean
clean:
	@docker-compose down --remove-orphans --rmi all

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  - start: Start the Docker Compose project in the foreground."

# Make the "start" target the default target when you run just "make"
.DEFAULT_GOAL := start
