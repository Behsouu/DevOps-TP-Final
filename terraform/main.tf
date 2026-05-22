# On utilise le provider Docker pour Terraform
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Réseau Docker partagé entre les containers
resource "docker_network" "app_network" {
  name = "devops_network"
}

# Container PostgreSQL
resource "docker_container" "db" {
  name  = "terraform_db"
  image = "postgres:15-alpine"

  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=devops_tp"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }

  ports {
    internal = 5432
    external = 5433  # 5433 pour ne pas conflicter avec Docker Compose
  }
}

# Container Backend
resource "docker_container" "backend" {
  name  = "terraform_backend"
  image = "devops-tp-final-backend"  # image buildée par docker-compose

  env = [
    "PORT=3000",
    "DB_HOST=terraform_db",
    "DB_PORT=5432",
    "DB_USER=postgres",
    "DB_PASSWORD=postgres",
    "DB_NAME=devops_tp"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }

  ports {
    internal = 3000
    external = 3001  # 3001 pour ne pas conflicter
  }

  depends_on = [docker_container.db]
}