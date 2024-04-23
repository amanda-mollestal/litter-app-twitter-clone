module "jump_host" {
  source = "./modules/jump_host"

  # Server related variables
  image_name  = var.image_name

  # SSH related variables
  identity_file = var.identity_file
  key_pair = var.key_pair
  private_key_pem = tls_private_key.k8s_key.private_key_pem

  # Network related variables
  subnet_cidr = var.jump_host_cidr
}

module "k8s" {
  source = "./modules/k8s"

  # Server related variables
  image_name  = var.image_name

  # Kubernetes related variables
  # control_plane_node_count = 3 # Defaults to 2
  # worker_node_count = 5 # Defaults to 3

  # SSH related variables
  identity_file = var.identity_file
  key_pair = openstack_compute_keypair_v2.litter_k8s_keypair.name
  private_key = tls_private_key.k8s_key.private_key_pem

  # Network related variables
  jump_host_ip = element(split(", ", module.jump_host.jump_host_ips), 0)
  router_id = module.jump_host.router_id
  subnet_cidr = var.k8s_cidr
  subnet_cidr_jump_host = var.jump_host_cidr
}
