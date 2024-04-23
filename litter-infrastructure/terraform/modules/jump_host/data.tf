#--------------------------------------------------------------------
# Data sources
#

# Retrieve the ID of the specified image
data "openstack_images_image_v2" "image" {
  name        = var.image_name
  most_recent = true
}

# Retrieve the ID of the specified flavor
data "openstack_compute_flavor_v2" "flavor" {
  name = var.flavor_name
}

# Retrieve the ID of the specified external network
data "openstack_networking_network_v2" "extnet" {
  name = var.external_network_name
}

# Retrieve the ID of the default security group
data "openstack_networking_secgroup_v2" "secgroup_default" {
  name = "default"
}

# Retrieve and render the cloud-init configuration file
data "template_file" "template_file_cloudinit" {
  template = file("${path.module}/.data/cloud-init.tpl")
}
