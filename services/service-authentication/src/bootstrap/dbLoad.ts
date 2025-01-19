import { container } from './container';
import { IDatabaseConnector } from '@kikerepo/infrastructure-common';

export async function dbLoad() {
  const dbConnector = container.resolve<IDatabaseConnector>('IDatabaseConnector');
  await dbConnector.connect();

}
