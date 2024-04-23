#--------------------------------------------------------------------
# Create a compute instance (jump host)
#
resource "openstack_compute_instance_v2" "jump_host" {
  depends_on        = [
    openstack_networking_router_interface_v2.router_interface
  ]
  name              = var.server_name
  image_id          = data.openstack_images_image_v2.image.id
  flavor_id         = data.openstack_compute_flavor_v2.flavor.id
  key_pair          = var.key_pair
  availability_zone = "Education"
  user_data         = data.template_file.template_file_cloudinit.rendered
  network {
    port = openstack_networking_port_v2.port.id
  }
}
