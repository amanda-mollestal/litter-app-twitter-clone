#--------------------------------------------------------------------
# Create a router for network traffic
#
resource "openstack_networking_router_v2" "router" {
  name = local.router_name
  external_network_id = data.openstack_networking_network_v2.extnet.id
}

#--------------------------------------------------------------------
# Create a network for the infrastructure
#
resource "openstack_networking_network_v2" "network" {
  name = local.network_name
}

#--------------------------------------------------------------------
# Create a subnet within the network
#
resource "openstack_networking_subnet_v2" "subnet" {
  name       = local.subnet_name
  network_id = openstack_networking_network_v2.network.id
  cidr       = var.subnet_cidr
  ip_version = 4
}

#--------------------------------------------------------------------
# Attach the subnet to the router
#
resource "openstack_networking_router_interface_v2" "router_interface" {
  router_id = openstack_networking_router_v2.router.id
  subnet_id = openstack_networking_subnet_v2.subnet.id
}

#--------------------------------------------------------------------
# Create a security group, and rule to allow SSH traffic
#
resource "openstack_networking_secgroup_v2" "secgroup_ssh" {
  name        = "jump-host-ssh-public"
  description = "Allow SSH traffic from public"
}

resource "openstack_networking_secgroup_rule_v2" "secgroup_rule_ssh" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 22
  port_range_max    = 22
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.secgroup_ssh.id
}

#--------------------------------------------------------------------
# Create a port for network connections
#
resource "openstack_networking_port_v2" "port" {
  name               = local.port_name
  network_id         = openstack_networking_network_v2.network.id
  admin_state_up     = "true"
  security_group_ids = [
    data.openstack_networking_secgroup_v2.secgroup_default.id,
    openstack_networking_secgroup_v2.secgroup_ssh.id
  ]
  fixed_ip {
    subnet_id = openstack_networking_subnet_v2.subnet.id
  }
}

#--------------------------------------------------------------------
# Allocate a floating IP for external access
#
resource "openstack_networking_floatingip_v2" "floatingip" {
  pool = "public"
}

#--------------------------------------------------------------------
# Associate the floating IP with the port
#
resource "openstack_networking_floatingip_associate_v2" "floatingip_association" {
  depends_on = [ 
    openstack_networking_floatingip_v2.floatingip,
    openstack_networking_port_v2.port,
    openstack_networking_router_interface_v2.router_interface
  ]
  floating_ip = openstack_networking_floatingip_v2.floatingip.address
  port_id     = openstack_networking_port_v2.port.id
}

