import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      email: string;
      avatar_url: string;
    };
  }
}
