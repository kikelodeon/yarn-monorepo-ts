// domain-user/src/entities/User.ts
import { AggregateRoot } from '@kikerepo/domain-common';
import { UserId, Email, Password, Phone } from '../value-objects';
import { UserCreatedEvent } from '../events/UserCreatedEvent';

export class User extends AggregateRoot<UserId> {
  private _email: Email;
  private _password: Password;
  private _phone?: Phone;

  /**
   * El constructor recibe VO ya construidos (y no dispara eventos).
   * Lo hacemos público, pero OJO: 
   * - Normalmente lo dejaríamos `private` o `protected` 
   *   si quieres forzar a que siempre usen la factoría `create`.
   */
  public constructor(
    id: UserId,
    email: Email,
    password: Password,
    phone?: Phone
  ) {
    super(id);
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
  public static create(
    email: string,
    password: string,
    phone?: string
  ): User {
    // 1) Generar ID y crear Value Objects
    const userId = new UserId(); // genera un UUIDv6 (por ejemplo)
    const emailVO = new Email(email); 
    const passwordVO = new Password(password);
    const phoneVO = phone ? new Phone(phone) : undefined;

    // 2) Llamar al constructor con VO
    const user = new User(userId, emailVO, passwordVO, phoneVO);

    // 3) Emitir evento de dominio para un user nuevo
    user.addDomainEvent(
      new UserCreatedEvent(userId.value, emailVO.value, phoneVO?.value),
    );

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

  get password(): Password {
    return this._password;
  }

  get phone(): Phone | undefined {
    return this._phone;
  }

  // Ejemplo: un "setter" (método) para cambiar la contraseña:
  public changePassword(newPassword: string) {
    this._password = new Password(newPassword);
    // Emite un PasswordChangedEvent si deseas
  }
}
