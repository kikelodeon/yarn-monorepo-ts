
// infrastructure-user/src/persistence/UserMapper.ts
import { User } from '@kikerepo/domain-user';
import { UserDocument } from './UserModel';
import { Email, Password, Phone, UserId } from '@kikerepo/domain-user';

/**
 * Convertir Entidad de Dominio a un objeto que Mongoose sepa manejar
 */
export function toPersistence(user: User) {
  return {
    id: user.id.value,
    email: user.email.value,
    password: user.password.value,
    phone: user.phone?.value,
  };
}

/**
 * Convertir doc de Mongoose a Entidad de Dominio
 */
export function toDomain(doc: UserDocument): User {
  // Creamos la Entidad (User) con constructor o factoría
  const userIdVO = new UserId(doc.id);
  const emailVO = new Email(doc.email);
  const passwordVO = new Password(doc.password);
  const phoneVO = doc.phone ? new Phone(doc.phone) : undefined;

  // new User(...) dispara el constructor y events
  // OJO: a veces, para "re-hidratar" no queremos volver a disparar
  // un 'UserCreatedEvent'. Podrías tener un constructor "privado"
  // o un `User.reconstitute(...)` que NO dispare eventos
  const user = new User(userIdVO, emailVO, passwordVO, phoneVO);

  // si hay domain events generados "accidentalmente", límpialos
  user.clearDomainEvents();

  return user;
}
