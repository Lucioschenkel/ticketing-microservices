import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties required to create a new user
interface IUserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that a user model has
interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attrs: IUserAttrs): IUserDocument
}

// An interface that describes the properties that a user document has
interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      Reflect.deleteProperty(ret, 'password');

      Object.assign(ret, { id: ret._id });

      Reflect.deleteProperty(ret, '_id');
    },
    versionKey: false,
  }
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

userSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs)
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export { User };
