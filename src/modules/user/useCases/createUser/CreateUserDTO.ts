export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  location: GeoJSON.Position;
  role?: number; //!Temporary,
  verified?: boolean; //!Temporary,
}
