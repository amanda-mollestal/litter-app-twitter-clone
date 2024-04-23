#--------------------------------------------------------------------
# Outputs
#

output "jump_host_ips" {
  description = "Jump host's IP addresses"
  value       = "${openstack_networking_floatingip_v2.floatingip.address}, ${openstack_compute_instance_v2.jump_host.access_ip_v4}"
}
output "router_id" {
  description = "Router ID"
  value       = openstack_networking_router_v2.router.id
}
