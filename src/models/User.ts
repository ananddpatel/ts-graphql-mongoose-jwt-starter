import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    created: { type: Date, default: new Date() }
  },
  {
    toObject: {
      // tslint:disable-next-line:variable-name
      transform: (_doc, ret) => {
        delete ret.__v;
      }
    }
  }
);

// before saving changes, run this
UserSchema.pre("save", function(next) {
  // tslint:disable-next-line:no-this-assignment
  const user = this as any;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (saltingErr, salt) => {
      if (saltingErr) {
        return next(saltingErr);
      }
      bcrypt.hash(user.password, salt, (hashingErr, hash) => {
        if (hashingErr) {
          return next(hashingErr);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function(pw: string, cb: any) {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export default mongoose.model("User", UserSchema);
