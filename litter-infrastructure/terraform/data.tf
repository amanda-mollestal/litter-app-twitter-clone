#--------------------------------------------------------------------
# Data sources
#

# Retrieve the ID of the specified external network
data "openstack_networking_network_v2" "extnet" {
  name = var.external_network_name
}

# Retrieve the ID of the default security group
data "openstack_networking_secgroup_v2" "secgroup_default" {
  name = "default"
}

# Generate an ED25519 SSH key pair
resource "tls_private_key" "k8s_key" {
  # algorithm = "ED25519" 
  algorithm = "RSA"
  rsa_bits = 4096
}

# Create an OpenStack key pair using the public key from the generated SSH key pair
resource "openstack_compute_keypair_v2" "litter_k8s_keypair" {
  name       = "litter_k8s_keypair"
  public_key = replace(tls_private_key.k8s_key.public_key_openssh, "\n", "")
}
