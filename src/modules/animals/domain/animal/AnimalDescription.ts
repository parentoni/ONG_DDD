import { Guard, GuardError } from "../../../../shared/core/Guard";
import { CommonUseCaseResult } from "../../../../shared/core/Response/UseCaseError";
import { Either, left, right } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
const test = "";
interface AnimalDescriptionProps {
  value: string;
}

export class AnimalDescription extends ValueObject<AnimalDescriptionProps> {
  private static MAX_LENGTH = 1500;
  private static MIN_LENGTH = 5;

  get value(): string {
    return this.props.value;
  }

  private static validate(description: string): Either<GuardError | CommonUseCaseResult.InvalidValue, string> {
    const guardResult = Guard.againstNullOrUndefined(description, "ANIMAL_DESCRIPTION");
    if (guardResult.isLeft()) {
      return left(guardResult.value);
    }

    const trimedString = description.trim();
    if (trimedString.length < this.MAX_LENGTH && trimedString.length > this.MIN_LENGTH) {
      return right(trimedString);
    }

    return left(
      CommonUseCaseResult.InvalidValue.create({
        location: `${AnimalDescription.name}.${this.validate.name}`,
        variable: "ANIMAL_DESCRIPTION",
        errorMessage: `Animal description length must be between ${this.MIN_LENGTH} and ${this.MAX_LENGTH} characters.`
      })
    );
  }

  public static create(props: AnimalDescriptionProps): Either<GuardError | CommonUseCaseResult.InvalidValue, AnimalDescription> {
    const validateResult = this.validate(props.value);
    if (validateResult.isLeft()) {
      return left(validateResult.value);
    }

    return right(new AnimalDescription({ value: validateResult.value }));
  }
}
