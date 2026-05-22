variable "db_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  default     = "postgres"
}

variable "app_port" {
  description = "Port du backend"
  type        = number
  default     = 3000
}