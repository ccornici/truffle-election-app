const assert = require('assert');

const Election = artifacts.require('./Election.sol');

contract('Election', (accounts) => {
  it('should initialize with two candidates', async () => {
    const electionContract = await Election.deployed();
    const candidatesCount = await electionContract.candidatesCount();

    expect(candidatesCount.toNumber()).to.eql(2);
  });

  it('should add expected candidates', async () => {
    const electionContract = await Election.deployed();

    const firstCandidate = await electionContract.candidates(1);
    expect(firstCandidate[0].toNumber(), 'Ids should match').to.eql(1);
    expect(firstCandidate[1], 'Names should match').to.eql('Candidate 1');
    expect(firstCandidate[2].toNumber(), 'Vote counts should match').to.eql(0);

    const secondCandidate = await electionContract.candidates(2);
    expect(secondCandidate[0].toNumber(), 'Ids should match').to.eql(2);
    expect(secondCandidate[1], 'Names should match').to.eql('Candidate 2');
    expect(secondCandidate[2].toNumber(), 'Vote counts should match').to.eql(0);
  });

  it('should allow voter to cast first vote', async () => {
    // ARRANGE
    const electionContract = await Election.deployed();
    const voterAddress = accounts[0];
    const candidateId = 1;

    // ACT
    await electionContract.vote(candidateId, { from: voterAddress });

    // ASSERT
    const hasVoted = await electionContract.voters(voterAddress);
    expect(hasVoted).to.be.true;

    const firstCandidate = await electionContract.candidates(candidateId);
    const voteCount = await firstCandidate[2].toNumber();
    expect(voteCount).to.eql(1);
  });

  it('should throw on invalid candidate', async () => {
    // ARRANGE
    const electionContract = await Election.deployed();
    const voterAddress = accounts[1];
    const invalidCandidate = 1337;

    // ACT
    const act = () => electionContract.vote(invalidCandidate, { from: voterAddress });

    // ASSERT
    await assert.rejects(act, (err) => {
      expect(err.reason).to.eql('Invalid candidate!');
      return true;
    });
  });

  it('should throw on double vote attempt', async () => {
    // ARRANGE
    const electionContract = await Election.deployed();
    const voterAddress = accounts[2];
    const candidateId = 1;

    // ACT
    await electionContract.vote(candidateId, { from: voterAddress }); // 1st vote
    const act = () => electionContract.vote(candidateId, { from: voterAddress }); // 2nd vote

    // ASSERT
    await assert.rejects(act, (err) => {
      expect(err.reason).to.eql('You already voted!');
      return true;
    });

    const firstCandidate = await electionContract.candidates(1);
    const firstCandidateVotes = firstCandidate[2].toNumber();
    // First candidate got 2 votes from 2 different accounts already.
    expect(firstCandidateVotes, 'Wrong vote count for first candidate').to.eql(2);

    const secondCandidate = await electionContract.candidates(2);
    const secondCandidateVotes = secondCandidate[2].toNumber();
    expect(secondCandidateVotes, 'Wrong vote count for second candidate').to.eql(0);
  });
});