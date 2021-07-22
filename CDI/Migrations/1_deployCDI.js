 var CedarDesign = artifacts.require('./CedarDesign.sol');

 module.exports = function(deployer) {
 	deployer.deploy(CedarDesign, 22000000);
 };