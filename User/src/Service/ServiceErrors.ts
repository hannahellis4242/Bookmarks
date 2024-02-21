const ServiceErrors = {
    NotFound: "NotFound",
    NotImpl:"NotImpl",
    TooMany:"TooMany",
    DBError:"DBError",
  } as const;

type ServiceErrors = typeof ServiceErrors[keyof typeof ServiceErrors];
export default ServiceErrors;
