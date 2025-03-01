// domain-user/src/entities/User.ts
import { AggregateRoot, CreationDate, DeletionDate } from '@kikerepo/domain-common';
import { UserId, Email, HashedPassword, Phone} from '../value-objects';
import { UserCreatedEvent } from '../events/UserCreatedEvent';

export class User extends AggregateRoot<UserId> {
  private _email: Email;
  private _password: HashedPassword;
  private _phone?: Phone;

  /**
   * El constructor recibe VO ya construidos (y no dispara eventos).
   * Lo hacemos público, pero OJO: 
   * - Normalmente lo dejaríamos `private` o `protected` 
   *   si quieres forzar a que siempre usen la factoría `createUnique`.
   */
  private constructor(
    id: UserId,
    email: Email,
    password: HashedPassword,
    phone?: Phone,
    creationDate?: CreationDate,
    deletionDate?: DeletionDate,
  ) {
    super(id,creationDate,deletionDate);
    this._email = email;
    this._password = password;
    this._phone = phone;
    this.validate();
  }

  /**
   * Método estático/factoría para crear un "User" *nuevo*.
   * Recibe valores primitivos, construye VO, llama al constructor
   * y emite un evento.
   */
  public static createUnique(
    email: Email,
    password: HashedPassword,
    phone?: Phone
  ): User {
    // 1) Generar ID y crear Value Objects
    const userId = new UserId(); // genera un UUIDv6 (por ejemplo)

    // 2) Llamar al constructor con VO
    const user = new User(userId, email, password, phone);

    // 3) Emitir evento de dominio para un user nuevo
    user.addDomainEvent(
      new UserCreatedEvent(userId.value, email.value, phone?.value),
    );

    return user;
  }
  public static map(
    id: string,
    email: string,
    password: string,
    phone: string|null,
    creationDate: Date,
    deletionDate: Date|null
  ): User {
    // 1) Generar ID y crear Value Objects
    const userId = new UserId(id); // genera un UUIDv6 (por ejemplo)
    const emailVO = new Email(email); 
    const passwordVO = new HashedPassword(password);
    const phoneVO = phone ? new Phone(phone) : undefined;
    const creationDateVO = new CreationDate(creationDate) ;
    const deletionDateVO = deletionDate ? new DeletionDate(deletionDate) : undefined;
    // 2) Llamar al constructor con VO
    const user = new User(userId, emailVO, passwordVO, phoneVO,creationDateVO,deletionDateVO);
    return user;
  }
  
  private validate(): void {
    // Aquí podrías poner chequeos complementarios (si fuese necesario)
    if (!this._email) {
      throw new Error('Email requerido');
    }
    if (!this._password) {
      throw new Error('Password requerida');
    }
  }

  // Getters
  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get password(): HashedPassword {
    return this._password;
  }

  get phone(): Phone | undefined {
    return this._phone;
  }

  public changePassword(newPassword: HashedPassword) {
    this._password = new HashedPassword(newPassword.value);
    // Emite un PasswordChangedEvent si deseas
  }
}
