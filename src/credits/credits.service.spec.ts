import { Test, TestingModule } from '@nestjs/testing';
import { CreditsService } from './credits.service';
import { DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CreditsService', () => {
  let service: CreditsService;

  // Mocks
  const mockCreditTxRepo = { create: jest.fn() };
  const mockEventEmitter = { emit: jest.fn() };
  const mockAuditQueue = { add: jest.fn() };
  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditsService,
        { provide: 'CreditTransactionRepository', useValue: mockCreditTxRepo },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: 'AuditQueue', useValue: mockAuditQueue },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<CreditsService>(CreditsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw if fromUserId equals toUserId', async () => {
    await expect(
        service.transferCredits({ fromUserId: '1', toUserId: '1', amount: 10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if sender user not found', async () => {
    mockDataSource.transaction.mockImplementationOnce(async (cb) => {
      return cb({
        findOne: jest.fn().mockResolvedValueOnce(null),
      });
    });

    await expect(
        service.transferCredits({ fromUserId: '1', toUserId: '2', amount: 10 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if recipient user not found', async () => {
    mockDataSource.transaction.mockImplementationOnce(async (cb) => {
      const findOneMock = jest
          .fn()
          .mockResolvedValueOnce({ id: '1', credits: 20 }) // fromUser
          .mockResolvedValueOnce(null); // toUser

      return cb({
        findOne: findOneMock,
      });
    });

    await expect(
        service.transferCredits({ fromUserId: '1', toUserId: '2', amount: 10 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if insufficient credits', async () => {
    mockDataSource.transaction.mockImplementationOnce(async (cb) => {
      const findOneMock = jest
          .fn()
          .mockResolvedValueOnce({ id: '1', credits: 5 }) // fromUser (only 5 credits)
          .mockResolvedValueOnce({ id: '2', credits: 0 }); // toUser

      return cb({
        findOne: findOneMock,
      });
    });

    await expect(
        service.transferCredits({ fromUserId: '1', toUserId: '2', amount: 10 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should transfer credits successfully', async () => {
    // Mock users with enough credits
    const fromUser = { id: '1', credits: 20 };
    const toUser = { id: '2', credits: 10 };

    // Mock credit transaction entity
    const creditTx = { id: 'tx1' };
    mockCreditTxRepo.create.mockReturnValue(creditTx);

    // Mock transaction manager
    const saveMock = jest.fn();
    mockDataSource.transaction.mockImplementationOnce(async (cb) => {
      return cb({
        findOne: jest
            .fn()
            .mockResolvedValueOnce(fromUser) // fromUser
            .mockResolvedValueOnce(toUser), // toUser
        save: saveMock,
      });
    });

    await service.transferCredits({ fromUserId: '1', toUserId: '2', amount: 10 });

    // Check credits updated correctly
    expect(fromUser.credits).toBe(10);
    expect(toUser.credits).toBe(20);

    // Check create was called
    expect(mockCreditTxRepo.create).toHaveBeenCalledWith({
      fromUserId: '1',
      toUserId: '2',
      amount: 10,
    });

    // Check save was called 3 times (tx, fromUser, toUser)
    expect(saveMock).toHaveBeenCalledTimes(3);

    // Check event emitted
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('credits.transferred', {
      fromUserId: '1',
      toUserId: '2',
      amount: 10,
      newBalanceFrom: 10,
      newBalanceTo: 20,
    });

    // Check audit queue added
    expect(mockAuditQueue.add).toHaveBeenCalledWith('credit-transfer', expect.any(Object));
  });
});
