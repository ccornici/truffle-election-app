// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;
    string public candidate;

    mapping(address => bool) public voters;

    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    }

    function vote(uint256 candidateId) public {
        require(!voters[msg.sender], "You already voted!");
        require(
            candidateId >= 1 && candidateId <= candidatesCount,
            "Invalid candidate!"
        );

        // Register vote & increment vote count
        voters[msg.sender] = true;
        candidates[candidateId].voteCount++;
    }
}
