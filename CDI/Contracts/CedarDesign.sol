pragma solidity ^0.5.0;

contract CedarDesign{
	string public name = 'CedarDesign';
	string public logo = 'CDI';
	string public version = 'v2.2';
	uint public stock;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _figure
	);

	event Approve(
		address indexed _possessor,
		address indexed _costumer,
		uint256 _figure
	);

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	constructor(uint256 _initialStock) public { 
		balanceOf[msg.sender] = _initialStock;
		stock = _initialStock;
	}

	function transfer(address _to, uint256 _figure) public returns (bool successful) {
		require (balanceOf[msg.sender] >= _figure);
		balanceOf[msg.sender] -= _figure;
		balanceOf[_to] += _figure;
		emit Transfer(msg.sender, _to, _figure);
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _figure) public returns (bool successful) {
		require(_figure <= balanceOf[_from]);
		require(_figure <= allowance[_from][msg.sender]);
		balanceOf[_from] -= _figure;
		balanceOf[_to] += _figure;
		allowance[_from][msg.sender] -= _figure;
		emit Approve(_from, _to, _figure);
		return true;
	}

	function approve(address _costumer, uint256 _figure) public returns (bool successful) {
		allowance[msg.sender][_costumer] = _figure;
		emit Approve(msg.sender, _costumer, _figure);
		return true;
	}
}